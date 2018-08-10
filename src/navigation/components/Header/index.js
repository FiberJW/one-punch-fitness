import React, { Component } from "react";
import Label from "../TabBar/Label";
import Container from "./styled/Container";
import Back, { PlaceHolder } from "./BackButton";

export default class Header extends Component {
  render() {
    console.log(this.props);

    return (
      <Container>
        {this.props.navigation.state.index ? (
          <Back navigation={this.props.navigation} />
        ) : (
          <PlaceHolder />
        )}
        <Label text={this.props.scene.route.routeName} disabled focused />
        <PlaceHolder />
      </Container>
    );
  }
}
