import React, {Component} from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENTS_PRICE = {
    salad: 0.6 ,
    bacon: 0.6,
    cheese: 0.7,
    meat: 1.5,
};

class BurgerBuilder extends Component{
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0 
        },
        totalPrice: 4,
        purchasable: false,
        purchasing: false
    }

    updatePurchasable(ingredients) {
        const sum = Object.keys(ingredients)
            .map((igKey) => {
                return ingredients[igKey];
            })
            .reduce((total, currentElem) => {
                return total + currentElem
            },0);

        this.setState({purchasable: sum > 0});
    }


    addIngredientHandler = (type) => {
        const oldIngredientCount = this.state.ingredients[type];
        const updatedCount = oldIngredientCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENTS_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({ingredients: updatedIngredients, totalPrice: newPrice}); 
        this.updatePurchasable(updatedIngredients);

    }

    removeIngredientHandler = (type) =>{
        const oldIngredientCount = this.state.ingredients[type];
        if(oldIngredientCount <= 0){
            return;
        }
        const updatedCount = oldIngredientCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const oldPrice = this.state.totalPrice;
        const priceDeduction = INGREDIENTS_PRICE[type];
        const updatedPrice = oldPrice - priceDeduction;
        this.setState({ingredients: updatedIngredients, totalPrice: updatedPrice});
        this.updatePurchasable(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        alert("Continue with checkout !!!");
    }

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        console.log("disabledINfo", disabledInfo);
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    <OrderSummary 
                        purchaseCancelled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler}
                        ingredients={this.state.ingredients} 
                        price={this.state.totalPrice}/>
                </Modal>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls 
                    ingredientAdded= {this.addIngredientHandler}
                    ingredientRemoved= {this.removeIngredientHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    ordered= {this.purchaseHandler}
                    purchasable={this.state.purchasable}/>
            </Aux>
        );
    }
}

export default BurgerBuilder;