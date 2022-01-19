/**
 * @format
 * @flow strict-local
 */
import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const RenderItem = ({item, index}) => {
  return (
    <View style={styles.slideContainer}>
      <Image source={{uri: item.imgUrl}} style={styles.slideImage} />
      <Text style={styles.slideHeader}>{item.title}</Text>
      <Text style={styles.slideBody}>{item.body}</Text>
    </View>
  );
};

const HomeScreen = () => {
  const [items, setItems] = useState([
    {
      title: 'Item 1',
      body: 'Lorem ipsum donor 1 2 3 4',
      imgUrl:
        'https://images.freeimages.com/images/large-previews/3ff/chain-link-fence-1187948.jpg',
    },
    {
      title: 'Item 2',
      body: 'Lorem ipsum donor 1 2 3 4',
      imgUrl:
        'https://images.freeimages.com/images/large-previews/4c9/i-ll-bite-1198797.jpg',
    },
    {
      title: 'Item 3',
      body: 'Lorem ipsum donor 1 2 3 4',
      imgUrl:
        'https://images.freeimages.com/images/large-previews/c9b/knot-1312069.jpg',
    },
    {
      title: 'Item 4',
      body: 'Lorem ipsum donor 1 2 3 4',
      imgUrl:
        'https://images.freeimages.com/images/large-previews/ec1/rain-drops-grass-nature-1642017.jpg',
    },
    {
      title: 'Item 5',
      body: 'Lorem ipsum donor 1 2 3 4',
      imgUrl:
        'https://images.freeimages.com/images/large-previews/789/yello-flower-1641954.jpg',
    },
  ]);
  return (
    <ScrollView>
      <Text style={{fontSize: 20}}>Home Screen</Text>
      <View style={{alignItems: 'center', backgroundColor: 'yellow'}}>
        <Carousel
          layout={'tinder'}
          layoutCardOffset={5}
          data={items}
          sliderWidth={300}
          itemWidth={300}
          renderItem={RenderItem}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  slideContainer: {
    width: ITEM_WIDTH,
    paddingBottom: 40,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },

  slideImage: {
    width: ITEM_WIDTH,
    height: 300,
  },
  slideHeader: {
    color: '#222',
    fontSize: 28,
    fontWeight: 'bold',
    paddingLeft: 20,
    paddingTop: 20,
  },
  slideBody: {
    color: '#222',
    fontSize: 18,
    paddingLeft: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default HomeScreen;
