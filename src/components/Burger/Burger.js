import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    let transformedIngredient = Object.keys(props.ingredients)
        .map((igKey) => {
            return [...Array(props.ingredients[igKey])].map((elem, index) => {
                return <BurgerIngredient key={igKey + index} type={igKey} />
            })
        })
        .reduce((total, currentEle) => {
            return total.concat(currentEle);
        }, []);
    console.log('transformedIngredient', transformedIngredient);
    if(transformedIngredient.length === 0) {
        transformedIngredient = "Please start adding Ingredients!!";
    }
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredient}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
}

export default burger;