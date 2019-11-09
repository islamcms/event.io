import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Switch } from 'react-native';
import Slider from 'react-native-slider';
import BaseMultiLineTextInput from '../components/BaseMultilineTextInput';
import { AuthContext } from '../context/AuthContext';
import PostListItemContainer from '../components/PostListItemContainer';
import { PostContext } from '../context/PostContext';

PostScreen.navigationOptions = {
  title: 'Post',
};

export default function PostScreen({ navigation }) {
  const authCtx = useContext(AuthContext);
  const { setPost, fetchFeed, fetchProfile } = useContext(PostContext);
  const [body, setBody] = useState('');

  const onSubmit = async () => {
    if (!body) return console.log('must provide title and body');
    const post = navigation.getParam('post', null);
    const url = post ? `/posts/${post._id}` : '/posts';
    const res = await authCtx.get(url, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        body,
        public: true,
      }),
    });
    if (res.ok) {
      try {
        const data = await res.json();
        setPost(data._id, data);
        if (!post) {
          fetchFeed();
          fetchProfile(authCtx.user.uid);
        }
        navigation.goBack();
      } catch (err) {
        console.log(err);
      }
    } else [console.log('Error: Server resoonded with status', res.status)];
  };

  return (
    <View style={{ flex: 1 }}>
      {navigation.getParam('post', null) && (
        <View>
          <PostListItemContainer
            post={navigation.getParam('post')}
            showOptions={false}
          />
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: 'lightgray',
            }}></View>
        </View>
      )}
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <BaseMultiLineTextInput
          autoFocus={true}
          returnKeyType="done"
          style={styles.bodyContainer}
          placeholder="Enter text here."
          onChangeText={text => setBody(text)}
        />
        <TouchableOpacity onPress={onSubmit} style={styles.button}>
          <Text style={styles.buttonLabel}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    marginTop: 16,
    marginLeft: 'auto',
    borderRadius: 6,
    backgroundColor: '#0275d8',
  },
  buttonLabel: {
    fontSize: 16,
    color: 'white',
  },
  background: {},
  expiryLabel: {
    fontStyle: 'italic',
    marginBottom: 24,
  },
  bodyContainer: { flex: 1 },
});
