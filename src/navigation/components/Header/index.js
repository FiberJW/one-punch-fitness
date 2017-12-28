import React, { Component } from "react";
import Label from "../TabBar/Label";
import Container from "./styled/Container";
import Back, { PlaceHolder } from "./BackButton";

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
