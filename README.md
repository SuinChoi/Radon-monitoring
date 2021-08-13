#### 상세설명은 word파일 MQTT-WEBSOCKET-OVER-TLS_SSL와 index.js, index.html 주석에 있습니다.
#### 인증서 위치는 index.js의 option에서 바꿀 수 있습니다.   
   
# 웹서버 열기 : cmd 에서
```
npm start
```

# 인증서 생성 : cmd 에서
``` 
npm run keygen  
```
##### 또는 각각의 인증서들은 
```
npm run keygen:ca
npm run keygen:server
npm run keygen:client
```
# MQTT config 설정
```
# MQTT over TLS/SSL
listener 8883
protocol mqtt
cafile 파일위치넣기
keyfile  파일위치넣기
certfile  파일위치넣기
tls_version tlsv1.2
require_certificate true
# End of MQTT over TLS/SSL

# WebSockets over TLS/SSL
listener 9883
protocol websockets
cafile  파일위치넣기
keyfile  파일위치넣기
certfile  파일위치넣기
tls_version tlsv1.2
require_certificate true  
# End of WebSockets over TLS/SSL
```

# Preview
![webpreview](https://user-images.githubusercontent.com/30892803/63411886-79f43580-c431-11e9-87cd-77a82a7f6290.PNG)

