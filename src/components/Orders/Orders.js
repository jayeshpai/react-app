import React, { Component } from 'react';
import { connect } from 'react-redux';

import Order from '../Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {

    componentDidMount() {
        console.log("Inside componentDidMount in Orders");
        this.props.onFetchOrders();
    }

    render() {
        let orders = <Spinner />;
        console.log('render in Orders',this.props);
        if( !this.props.loading ) {
            orders = this.props.orders.map( order => (
                <Order
                    key={order.id}
                    ingredients={order.ingredients}
                    price={+order.price.toFixed(2)} />
            ))
        }
        return (
            <div>
                {orders}
            </div>
        );
        
    }
}
const mapStateToProps = state => {
    return {
        orders:  state.order.orders,
        loading: state.order.loading
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders:() => dispatch(actions.fetchOrders())
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(Orders, axios));