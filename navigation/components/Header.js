import React, { Component } from "react";
import Label from "./Label";
import Container from "./styled/HeaderContainer";
import Back, { PlaceHolder } from "./HeaderBackButton";

export default class Header extends Component {
  render() {
    const screenDetails = this.props.getScreenDetails(this.props.scene);

    return (
      <Container>
        {this.props.navigation.state.index ? (
          <Back navigation={this.props.navigation} />
        ) : (
          <PlaceHolder />
        )}
        <Label text={screenDetails.options.title} disabled focused />
        <PlaceHolder />
      </Container>
    );
  }
}
