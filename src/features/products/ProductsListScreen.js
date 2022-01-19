/**
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axiosInstance from '../../services/Axios';
import {PRODUCT_URL} from '../../utils/urls';
import {useSelector, useDispatch} from 'react-redux';
import {
  addToCartAsync,
  getFromCartAsync,
  removeFromCartAsync,
} from '../cart/cartSlice';

const Product = ({item, navigation}) => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    let unmounted = false;
    setIsLoading(true);
    if (item.images[0]) {
      axiosInstance
        .get(item.images[0])
        .then(res => {
          if (!unmounted) {
            setImage(res.data);
          }
        })
        .catch(err => {
          console.log('ProductScreen : Image loading failed :', err);
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }

    return () => {
      unmounted = true;
    };
  }, [item]);

  // ========================================================
  // Event handlers
  // ========================================================
  const handleAddToCart = (item, quantity) => {
    item['quantity'] = quantity;
    dispatch(addToCartAsync(item));
  };

  const handleDeleteFromCart = () => {
    dispatch(removeFromCartAsync(item.id));
  };

  const handleViewDetail = () => {
    navigation.navigate('ProductDetails', {productUrl: item.url});
  };

  return (
    <View key={item.url} style={styles.productContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.itemBody}>
        <TouchableOpacity onPress={() => handleViewDetail()}>
          {isLoading ? (
            <View style={styles.imageLoading}>
              <Text style={styles.loadingImageText}>Loading...</Text>
            </View>
          ) : image ? (
            <Image style={styles.imageThumb} source={{uri: image.image}} />
          ) : (
            <View style={styles.noImage}>
              <Text>No image</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text>
          Price:
          <Text style={{fontSize: 30}}>{item.regular_price}</Text>
        </Text>
        <TouchableOpacity
          onPress={() => handleAddToCart(item, 1)}
          style={{
            width: '100%',
            flex: 1,
            flexDirection: 'row',
            backgroundColor: 'tomato',
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="cart-plus" size={30} color="#fff" />
          <Text style={{color: '#fff', fontWeight: 'bold', marginLeft: 5}}>
            Add to Cart
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteFromCart()}
          style={{
            width: '100%',
            backgroundColor: 'steelblue',
            padding: 10,
            alignItems: 'center',
          }}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>
            Remove From Cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ==========================================================
// Product List Screen
// ==========================================================
const ProductsListScreen = ({navigation}) => {
  // const cart = useSelector(state => state.cart);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    console.log('Product Screen rendering....................');
    setIsLoading(true);
    axiosInstance
      .get(PRODUCT_URL)
      .then(res => {
        setProducts(res.data);
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        setError('Something went wrong...');
        console.log('Products screen (Get Products error :', err);
      });
  }, []);

  const renderItem = ({item}) => (
    <Product item={item} navigation={navigation} />
  );
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={products}
        renderItem={renderItem}
        columnWrapperStyle={{justifyContent: 'space-around'}}
        keyExtractor={(item, index) => index.toString()}
        extraData={products}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatList: {
    width: '100%',
  },
  productContainer: {
    backgroundColor: '#fff',
    padding: 10,
    width: 180,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  title: {
    fontSize: 15,
    color: '#555',
  },
  imageThumb: {
    resizeMode: 'contain',
    width: 150,
    height: 150,
  },
  imageLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
    width: 150,
    height: 150,
  },
  noImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bbb',
    width: 150,
    height: 150,
  },
});

export default ProductsListScreen;
