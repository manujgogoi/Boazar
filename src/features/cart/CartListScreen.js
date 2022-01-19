/**
 * @format
 * @flow strict-local
 */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import axiosInstance from '../../services/Axios';
import {
  increaseQuantityAsync,
  decreaseQuantityAsync,
  removeFromCartAsync,
} from './cartSlice';

const CartItem = ({product}) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [subTotal, setSubTotal] = useState(0);

  // Side effects to calculate subTotal of the product
  // ========================================================
  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      const price =
        product.discount_price > 0
          ? product.discount_price
          : product.regular_price;

      setSubTotal(price * product.quantity);
    }

    return () => {
      unmounted = true;
    };
  }, [product]);

  // Get product image

  useEffect(() => {
    let unmounted = false;
    setLoading(true);
    if (product.images[0]) {
      axiosInstance
        .get(product.images[0])
        .then(res => {
          if (!unmounted) {
            setImage(res.data);
          }
        })
        .catch(err => console.log('CartScreen->get product image error: ', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => {
      unmounted = true;
    };
  }, []);

  // EventHnadlers
  // ================================================
  const handleIncreaseQuantity = () => {
    dispatch(increaseQuantityAsync(product.id));
  };

  const handleDecreaseQuantity = () => {
    dispatch(decreaseQuantityAsync(product.id));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCartAsync(product.id));
  };

  return (
    <View style={styles.cartItem}>
      <View style={styles.itemPreview}>
        <Text>{product.title}</Text>
        {isLoading ? (
          <View style={styles.imageLoading}>
            <Text style={styles.loadingImageText}>Loading image...</Text>
          </View>
        ) : image ? (
          <Image style={styles.imageThumb} source={{uri: image.image}} />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageText}>No image</Text>
          </View>
        )}
      </View>
      <View style={styles.priceWrapper}>
        <Text
          style={[styles.price, product.discount_price && styles.wrong_price]}>
          ₹{product.regular_price}
        </Text>
        {product.discount_price && (
          <Text style={styles.price}>₹{product.discount_price}</Text>
        )}
      </View>
      <View style={styles.quantityControl}>
        <TouchableOpacity
          style={styles.quantityControlButton}
          onPress={() => handleIncreaseQuantity()}>
          <FA5Icon name="chevron-up" size={30} color="tomato" />
        </TouchableOpacity>
        {product.quantity ? (
          <Text style={styles.quantity}>{product.quantity}</Text>
        ) : (
          <Text>{0}</Text>
        )}
        <TouchableOpacity
          style={styles.quantityControlButton}
          onPress={() => handleDecreaseQuantity()}>
          <FA5Icon name="chevron-down" size={30} color="tomato" />
        </TouchableOpacity>
      </View>
      <View style={styles.total}>
        <Text style={styles.totalText}>₹{subTotal}</Text>
      </View>
      <View
        style={{
          backgroundColor: '#ccc',
          borderRadius: 20,
          padding: 10,
          position: 'absolute',
          right: 5,
          top: 5,
        }}>
        <TouchableOpacity onPress={() => handleRemoveFromCart()}>
          <AntIcon name="delete" color="red" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CartListScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const auth = useSelector(state => state.auth);
  const [grandOpen, setGrandOpen] = useState(false);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loadingGrandTotal, setLoadingGrandTotal] = useState(false);

  // Side Effect to get grandTotal
  useEffect(() => {
    setLoadingGrandTotal(true);
    let unmounted = false;
    let total = 0;
    if (!unmounted) {
      if (cart.products.length > 0) {
        cart.products.map(product => {
          total =
            total +
            product.quantity *
              (product.discount_price
                ? product.discount_price
                : product.regular_price);
        });
        console.log('Total : ', total);
      }
      setGrandTotal(total);
    }
    setLoadingGrandTotal(false);
    return () => {
      unmounted = true;
    };
  }, [cart]);

  // Event Handlers
  // =========================================
  const toggleGrand = () => setGrandOpen(!grandOpen);

  return (
    <>
      <ScrollView>
        {cart.status === 'pending' ? (
          <Text>Loading Cart items</Text>
        ) : cart.products.length > 0 ? (
          cart.products.map(product => (
            <CartItem key={product.url} product={product} />
          ))
        ) : (
          <Text>Empty cart.</Text>
        )}
      </ScrollView>
      <View style={[styles.grandSection, grandOpen && styles.grandSectionOpen]}>
        <View style={styles.grandTotalWrapper}>
          <Text style={styles.grandTotal}>
            Grand Total:
            {loadingGrandTotal ? (
              <Text>Calculating... </Text>
            ) : (
              <Text style={styles.grandTotalAmount}>₹{grandTotal}</Text>
            )}
          </Text>
        </View>
        <View style={styles.checkout}>
          {auth.isLoggedIn ? (
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => navigation.navigate('Checkout')}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.checkoutText}>Login to Checkout</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            toggleGrand();
          }}
          style={styles.grandSectionToggle}>
          <AntIcon name="menufold" color="white" size={30} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 5,
  },
  itemPreview: {
    width: 100,
  },
  title: {
    fontSize: 15,
    color: '#555',
  },
  imageThumb: {
    resizeMode: 'contain',
    width: 100,
    height: 100,
  },
  imageLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'steelblue',
    width: 100,
    height: 100,
  },
  loadingImageText: {
    color: '#fff',
    fontSize: 15,
  },
  noImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bbb',
    width: 100,
    height: 100,
  },
  noImageText: {
    color: '#fff',
    fontSize: 15,
  },
  quantityControl: {
    width: 60,
    backgroundColor: '#efefef',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityControlButton: {
    borderWidth: 2,
    borderColor: 'tomato',
    padding: 5,
    margin: 5,
    borderRadius: 5,
  },
  quantity: {
    fontSize: 15,
    fontWeight: 'bold',
    width: 50,
    textAlign: 'center',
    backgroundColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  priceWrapper: {
    backgroundColor: '#eee',
    width: 100,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  price: {
    fontSize: 18,
    color: 'tomato',
  },
  wrong_price: {
    color: '#888',
    textDecorationLine: 'line-through',
    fontSize: 15,
  },
  total: {
    width: 106,
    marginHorizontal: 5,
    backgroundColor: '#eee',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  totalText: {
    fontSize: 18,
    color: 'tomato',
  },
  grandSection: {
    width: '100%',
    backgroundColor: 'yellow',
    height: 60,
  },
  grandSectionOpen: {
    height: 250,
  },
  grandSectionToggle: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  grandTotalWrapper: {
    marginVertical: 15,
    alignItems: 'center',
  },
  grandTotal: {
    fontSize: 20,
  },
  grandTotalAmount: {
    fontWeight: 'bold',
  },
  checkout: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButton: {
    backgroundColor: 'tomato',
    padding: 10,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 20,
    textTransform: 'uppercase',
  },
});

export default CartListScreen;
