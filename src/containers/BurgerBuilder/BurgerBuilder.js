import React, {Component} from 'react';

import {connect} from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/action';




class BurgerBuilder extends Component{
    state = {
        purchasing: false,
        loading: false,
        error: false
    }
    
    componentDidMount() {
        // axios.get('https://react-burger-builder-pai.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients: response.data});
        //     }).catch(error => {
        //         this.setState({error: true});
        //     });
    }

    updatePurchasable(ingredients) {
        const sum = Object.keys(ingredients)
            .map((igKey) => {
                return ingredients[igKey];
            })
            .reduce((total, currentElem) => {
                return total + currentElem
            },0);

        return  sum > 0;
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        //alert("Continue with checkout !!!");
        
        // const queryParams = [];
        // for (let i in this.props.ings) {
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        // }
        // queryParams.push('price='+ this.state.totalPrice);  
        // const queryString = queryParams.join('&');
        this.props.history.push('/checkout');

    }

    render () {
        const disabledInfo = {
            ...this.props.ings
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        console.log("disabledINfo", disabledInfo);
        let orderSummary = null;
        let burgerBuildControl = this.state.error? 'Ingredients cannot be fetched': <Spinner />;
        if(this.props.ings) {
            burgerBuildControl = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls 
                        ingredientAdded= {this.props.onIngredientAdded}
                        ingredientRemoved= {this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        ordered= {this.purchaseHandler}
                        purchasable={this.updatePurchasable(this.props.ings )}/>
                </Aux>
            );
            orderSummary = <OrderSummary 
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}
            ingredients={this.props.ings} 
            price={this.props.price}/>
        }
        if(this.state.loading) {
            orderSummary= <Spinner />
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burgerBuildControl}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName}),

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));