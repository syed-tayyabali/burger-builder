import React, { Component } from 'react';
import Aux from '../../../hoc/Auxilliary/Auxilliary';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
    //this doesn't have to be class component anymore, this could be functional component.

    render() {
        const ingredientsSummary = Object.keys(this.props.ingredients).map(igkey => {
            return (
                <li key={igkey}>
                    <span
                        style={{ textTransform: 'capitalize' }}>{igkey}
                    </span> :{this.props.ingredients[igkey]}
                </li>);
        });

        return (
            <Aux>
                <h2>Your Order</h2>
                <p>A delicious burger with the following ingredients:</p>
                <ul>
                    {ingredientsSummary}
                </ul>
                <p><strong>Total price: {this.props.price.toFixed(2)} </strong></p>
                <p>Continue to CheckOut?</p>
                <Button btnType="Danger" clicked={this.props.purchaseCanceled}>Cancel</Button>
                <Button btnType="Success" clicked={this.props.purchaseContinue}>Continue</Button>
            </Aux>
        );
    }
}

export default OrderSummary;