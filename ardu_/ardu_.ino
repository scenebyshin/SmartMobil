#include <Wire.h>
#include <Adafruit_MLX90614.h>
#include <pm2008_i2c.h>
#include "DHT.h"

#define DHTPIN 2        // SDA 핀의 설정
#define DHTTYPE DHT22   // DHT22 (AM2302) 센서종류 설정
 
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
PM2008_I2C pm2008_i2c;
DHT dht(DHTPIN, DHTTYPE);

int redPin = 11;
int greenPin = 10;
int bluePin = 9;

String first="1)";
String second="2)";
String third="3)";

String comma=",";
String slash="/\n";

String temp="*C";
String percent="%";

String allString="";

void setup() {
  pm2008_i2c.begin();
  pm2008_i2c.command();
  
  dht.begin();
  mlx.begin();
  Serial.begin(9600);
}

void setColor(int red, int green, int blue)
{
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue); 
}

void loop() {
   delay(1000);
   /* 
   1. 미세먼지
   2. 온습도
   3. 체온 (비접촉식온도센서)
   */
   /*
   if( Serial.available())
  {
    Serial.write(Serial.read());
  }
 */
  
  //미세먼지
  uint8_t ret = pm2008_i2c.read();
  if (ret == 0) {
    allString=first+String(pm2008_i2c.pm10_tsi)+comma+String(pm2008_i2c.pm2p5_tsi)+slash;
  }
  
  //온습도
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  if (isnan(t) || isnan(h)) 
  {
  //값 읽기 실패시
  } 
  else {
   allString+=second+String(t)+temp+comma+String(h)+percent+slash;
  }
  
  //비접촉식온도센서
  allString+=third+String(mlx.readObjectTempC())+temp+slash;

  Serial.print(allString);
}
