import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxilliary/Auxilliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component {
    state = {
        purchasing: false,
        loading: false
    }

    componentDidMount() {
        console.log(this.props);
        this.props.onInitIngredients();
    }

    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updateCount = oldCount + 1;
    //     const updateIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updateIngredients[type] = updateCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({ totalPrice: newPrice, ingredients: updateIngredients });
    //     this.updatePurchaseState(updateIngredients);
    // };

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if (oldCount <= 0) {
    //         return;
    //     }
    //     else {
    //         const updateCount = oldCount - 1;
    //         const updateIngredients = {
    //             ...this.state.ingredients
    //         };
    //         updateIngredients[type] = updateCount;
    //         const priceAddition = INGREDIENT_PRICES[type];
    //         const oldPrice = this.state.totalPrice;
    //         const newPrice = oldPrice - priceAddition;
    //         this.setState({ totalPrice: newPrice, ingredients: updateIngredients });
    //         this.updatePurchaseState(updateIngredients);
    //     }
    // };

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients).map(igkey => {
            return ingredients[igkey];
        }).reduce((sum, el) => {
            return sum + el;
        }, 0);
        return sum > 0;
    }

    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState({ purchasing: true });
        } else {
            this.props.onSetRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    };

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        // alert('You Continue!');
        // const queryParams = [];
        // for (let i in this.state.ingredients) {
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        // }
        // queryParams.push('price=' + this.state.totalPrice);
        // const queryString = queryParams.join('&');
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render() {

        const disabledInfo = {
            ...this.props.ings
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;
        let burger = this.props.error ? <p>components can't be loaded</p> : <Spinner />;

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        ordered={this.purchaseHandler}
                        isAuth={this.props.isAuthenticated}
                        purchasable={this.updatePurchaseState(this.props.ings)} />
                </Aux>
            );
            orderSummary = <OrderSummary
                ingredients={this.props.ings}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinue={this.purchaseContinueHandler}
                price={this.props.price} />;
        }
        if (this.state.loading) {
            orderSummary = <Spinner />;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToprops = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        purchased: state.order.purchased,
        isAuthenticated: state.auth.token !== null
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    };
}

export default connect(mapStateToprops, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));