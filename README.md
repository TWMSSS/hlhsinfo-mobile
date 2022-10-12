# hlhsinfo-mobile
一個基於 [HLHSInfo](https://github.com/TWMSSS/hlhsinfo)之API 所做出來的行動裝置專用版本。

## 安裝

0. 請先進行`yarn`或`npm install`的動作，並且確保您電腦內含`React CLI`的安裝
1. 若您需要建置IOS裝置的版本，請先進行`pod install`的動作
2. 使用`react-native run-android`執行Android版本 或 `react-native run-ios`執行IOS版本

## 建置

> **Warning**
> 我並無測試使用IOS版本建置，若需要完整文檔請至`React Native`官方文檔查看!

> **Note**
> 建置Android版本時，您需要於`android/app`目錄底下生成`signing.keystore`之keystore簽名檔，並於`android`目錄底下新增`keystore.properties`檔案  
> 內容如下:
> ```properties
> storePassword=signing.keystore之密碼
> keyAlias=signing.keystore之alias
> keyPassword=keyAlias之密碼
> ```

 * **建置Android App Bundle** 使用命令`cd android && gradle bundleRelease`
 * **建置Android Application Package** 使用命令`cd android && gradle assembleRelease`