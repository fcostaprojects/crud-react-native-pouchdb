/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import { Actions } from 'react-native-router-flux';
import * as Database from '../db/database';


export default class EditBook extends Component {

  constructor(props) {
    super(props);
    this.state = { _id: '', name: '', author: '', _rev: '' };
    this._save = this._save.bind(this);
  }

  onChangeName(value) {
    this.setState({ name: value })
  }

  onChangeAuthor(value) {
    this.setState({ author: value })
  }

  componentDidMount() {
    if (this.props.item != undefined) {
      this.setState({ ...this.props.item })
    }

  }

  _save() {
    const bookDb = Database.getBookDb();
    if (this.state._id != '') {
      bookDb.put(this.state).then(() => { Actions.home(); })
    } else {
      bookDb.post(this.state).then(() => { Actions.home(); })
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => Actions.home()}>
              <Icon type="FontAwesome" name='arrow-left' />
            </Button>
          </Left>
          <Body>
            <Title>Crud RN Rxdb</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this._save()}>
              <Icon type="FontAwesome" name='save' />
            </Button>
          </Right>
        </Header>

        <View style={styles.vwContent}>
          <View>
            <Text style={styles.txtLabelInput}>Name</Text>
            <TextInput
              underlineColorAndroid="transparent"
              style={styles.txtInput}
              value={this.state.name}
              onChangeText={(texto) => this.onChangeName(texto)}
              maxLength={60}
            />
          </View>
          <View>
            <Text style={styles.txtLabelInput}>Author</Text>
            <TextInput
              underlineColorAndroid="transparent"
              style={styles.txtInput}
              value={this.state.author}
              onChangeText={(texto) => this.onChangeAuthor(texto)}
              maxLength={60}
            />
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#273472',
  },
  header: {
    backgroundColor: '#0d1125'
  },
  vwContent: {
    flex: 1,
    backgroundColor: '#273472',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10
  },
  txtLabelInput: {
    color: '#fff',
    fontSize: 13
  },
  txtInput: {
    fontSize: 16,
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: 3,
    height: 40,
  },
});
