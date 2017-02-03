/**
 * react-native-parabolic
 * @author Lei
 * @repo https://github.com/stoneWeb/react-native-parabolic
 */
'use strict';

 import React, { Component, PropTypes } from 'react'
 import {
   View,
   Animated
 } from 'react-native'

 export default class extends Component {

   static propTypes = {
     startX: PropTypes.number.isRequired,
     startY: PropTypes.number.isRequired,
     endX: PropTypes.number.isRequired,
     endY: PropTypes.number.isRequired,
     renderChildren: PropTypes.func,
     animateEnd: PropTypes.func,
     curvature: PropTypes.number,
     duration: PropTypes.number,
     style: View.propTypes.style
   }

   static defaultProps = {
     curvature: .003,
     duration: 350,
     startX: 0,
     startY: 0,
     endX: 0,
     endY: 0,
     animateEnd: function(){},
     renderChildren: function(){}
   }
   constructor(props){
     super(props)
     this.state = {
       animateBtnX: 0,
       animateBtnY: 0,
       runAnim: new Animated.Value(0),
     }
   }
   run(data = {}){
     this.state.runAnim.setValue(0)
     const { inputRange, outputX, outputY } = this.getPaths()
     this.setState({
       animateBtnX: this.state.runAnim.interpolate({
         inputRange, outputRange: outputX
       }),
       animateBtnY: this.state.runAnim.interpolate({
         inputRange, outputRange: outputY
       })
     })
     Animated.timing(this.state.runAnim, {
         toValue: inputRange.length,
         duration: 350
     }).start(() => { this.props.animateEnd(data) })
   }
   getPaths(){
     const { curvature, startX, startY, endX, endY } = this.props, speed = 500//166.67
     let diffX = endX - startX,
         diffY = endY - startY;
     let b = ( diffY - curvature * diffX * diffX ) / diffX,
         start_x = 0,
         rate = diffX > 0? 1: -1,
         inputRange = [], outputX = [], outputY = [];
     let step = () => {
         let tangent = 2 * curvature * start_x + b;
         start_x = start_x + rate * Math.sqrt(speed / (tangent * tangent + 1));
         if ((rate == 1 && start_x > diffX) || (rate == -1 && start_x < diffX)) {
           start_x = diffX;
         }
         let x = start_x, y = curvature * x * x + b * x;
         inputRange.push(outputX.length)
         outputX.push(x)
         outputY.push(y)
         if (start_x !== diffX) {
           step()
         }
       }
       step()
       return { inputRange, outputX, outputY }
   }
   render(){
     return (
       <Animated.View style={[this.props.style, {
         transform: [
           { translateX: this.state.animateBtnX },
           { translateY: this.state.animateBtnY }
         ]
       }]}>
        {this.props.renderChildren()}
       </Animated.View>
     )
   }
 }
