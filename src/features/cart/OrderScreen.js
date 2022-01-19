/**
 * @format
 * @flow strict-local
 */
import React from 'react';
import {View, Text} from 'react-native';

const OrderScreen = ({route, navigation}) => {
  const {addressUrl} = route.params;
  return (
    <View>
      <Text>Order Screen</Text>
      <Text>{addressUrl}</Text>
    </View>
  );
};

export default OrderScreen;

{
  /* <View>
        <Text>Items:</Text>
        {products.length > 0 ? (
          products.map(product => (
            <View key={product.url}>
              <View>
                <Text>{product.title}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                {product.images.length > 0 ? (
                  <View>
                    <ImageView imageUrl={product.images[0]} />
                  </View>
                ) : (
                  <Text>No image</Text>
                )}

                <View>
                  <Text>Price: {product.regular_price}</Text>
                  <Text>Quantity: {product.quantity}</Text>
                  <Text>Total: {product.regular_price * product.quantity}</Text>
                  <Text>
                    Vendor: <VendorView vendorUrl={product.vendor} />
                  </Text>
                </View>
              </View>
      //         {/* <Text>{JSON.stringify(product)}</Text> */
}
//       </View>
//     ))
//   ) : (
//     <Text>No products</Text>
//   )}
// </View> */}
