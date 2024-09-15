#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <LEAmDNS.h>
#include <VFS.h>
#include <LittleFS.h>
#include "wifisettings.h"

/*
#ifndef STASSID
#define STASSID "example_ssid"
#define STAPSK "example_passwrd"
const IPAddress ip(192,168,137,2);
const IPAddress subnet(255,255,255,0);
#endif

const char* ssid = STASSID;
const char* password = STAPSK;
*/

WebServer server(80);

#define LED_CONNECT 14
#define LED_ACTIVE 13
#define SW_RESET 15
const int led = LED_ACTIVE;

// ステータス
// 0: 起動中 10: ready 20: rolling 30: error
int system_status = 0;

void handleRoot() {
  digitalWrite(LED_ACTIVE, 1);
  server.send(200, "text/plain", "hello from pico w!\r\n");
  digitalWrite(LED_ACTIVE, 0);
}

void handleNotFound() {
  digitalWrite(LED_ACTIVE, 1);
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
  digitalWrite(LED_ACTIVE, 0);
}

void handleStatus(){
  digitalWrite(LED_ACTIVE, 1);
  if (server.method() != HTTP_GET) {
    server.send(405, "text/plain", "");
  }else{
    String message = "";
    if(system_status == 10){
      //10 ready
      message = "{\"status\": \"ready\"}";
    }
    if(system_status == 20){
      //20 rolling
      message = "{\"status\": \"rolling\"}";
    }
    if(system_status == 30){
      //30 error
      message = "{\"status\": \"error\"}";
    }
    server.send(200, "application/json", message);
  }
  digitalWrite(LED_ACTIVE, 0);
}

void handleRoll(){
  digitalWrite(LED_ACTIVE, 1);
  if (server.method() != HTTP_POST) {
    server.send(405, "text/plain", "");
  }else{
    String message = "";
    if(system_status == 10){
      //10 ready
      system_status = 20;
      message = "started rolling";
      server.send(202, "text/plain", message);
  }
    if(system_status == 20){
      //20 rolling
      message = "already on roll";
      server.send(400, "text/plain", message);
    }
    if(system_status == 30){
      //30 error
      message = "error";
      server.send(500, "text/plain", message);
    }
  }
  digitalWrite(LED_ACTIVE, 0);
}

void setup(void) {
  delay(1000);
  pinMode(LED_ACTIVE, OUTPUT);
  pinMode(LED_CONNECT, OUTPUT);
  pinMode(SW_RESET, INPUT_PULLUP);
  digitalWrite(LED_ACTIVE, 0);
  digitalWrite(LED_CONNECT, 0);
  Serial.begin(115200);

  /*
  // ファイルまわり
  LittleFS.begin();
  VFS.root(LittleFS);
  
  // WiFi 初期化モード
  if(digitalRead(SW_RESET) == LOW){
    FILE* fp;
    String strbuf;
    char blink = 0;
    char linebuf[40];
    for(char i = 0; i < 6; i += 1){
      blink = (blink + 1) % 2;
      digitalWrite(LED_CONNECT, blink);
      delay(150);
    }
    Serial.print("WiFi Reset Mode:\n");
    fp = fopen("wifi.txt", "w");

    Serial.print("SSID: \n");
    strbuf = Serial.readString();
    strbuf.toCharArray(linebuf, 39);
    fputs(linebuf, fp);
    Serial.print("Pass: \n");
    strbuf = Serial.readString();
    strbuf.toCharArray(linebuf, 39);
    fputs(linebuf, fp);

    Serial.print("IP: \n");
    strbuf = Serial.readString();
    strbuf.toCharArray(linebuf, 39);
    fputs(linebuf, fp);

    Serial.print("Subnet: \n");
    strbuf = Serial.readString();
    strbuf.toCharArray(linebuf, 39);
    fputs(linebuf, fp);

    fclose(fp);
    fp = NULL;
    fp = fopen("wifi.txt", "r");
    for(char i = 0; i < 4; i += 1){
      fgets(linebuf, 40, fp);
      Serial.print(linebuf);
    }
    Serial.print("end.");
    while(1){}
  }
  */

  // WiFi 接続設定
  WiFi.mode(WIFI_STA);
  WiFi.config(ip,ip,subnet);
  WiFi.begin(ssid, password);
  Serial.println("");

  // WiFi 接続待機
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(LED_CONNECT, HIGH);
    delay(100);
    digitalWrite(LED_CONNECT, LOW);
    delay(400);
    Serial.print(".");
  }
  // WiFi 接続成功
  digitalWrite(LED_CONNECT, HIGH);
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("picow")) {
    Serial.println("MDNS responder started");
  }

  //server.on("/", handleRoot);
  server.on("/status", handleStatus);
  server.on("/roll", handleRoll);

  server.onNotFound(handleNotFound);

  /////////////////////////////////////////////////////////
  // Hook examples

  server.addHook([](const String & method, const String & url, WiFiClient * client, WebServer::ContentTypeFunction contentType) {
    (void)method;       // GET, PUT, ...
    (void)url;          // example: /root/myfile.html
    (void)client;       // the webserver tcp client connection
    (void)contentType;  // contentType(".html") => "text/html"
    Serial.printf("A useless web hook has passed\n");
    return WebServer::CLIENT_REQUEST_CAN_CONTINUE;
  });

  server.addHook([](const String&, const String & url, WiFiClient*, WebServer::ContentTypeFunction) {
    if (url.startsWith("/fail")) {
      Serial.printf("An always failing web hook has been triggered\n");
      return WebServer::CLIENT_MUST_STOP;
    }
    return WebServer::CLIENT_REQUEST_CAN_CONTINUE;
  });

  server.addHook([](const String&, const String & url, WiFiClient * client, WebServer::ContentTypeFunction) {
    if (url.startsWith("/dump")) {
      Serial.printf("The dumper web hook is on the run\n");

      // Here the request is not interpreted, so we cannot for sure
      // swallow the exact amount matching the full request+content,
      // hence the tcp connection cannot be handled anymore by the
      auto last = millis();
      while ((millis() - last) < 500) {
        char buf[32];
        size_t len = client->read((uint8_t*)buf, sizeof(buf));
        if (len > 0) {
          Serial.printf("(<%d> chars)", (int)len);
          Serial.write(buf, len);
          last = millis();
        }
      }
      // Two choices: return MUST STOP and webserver will close it
      //                       (we already have the example with '/fail' hook)
      // or                  IS GIVEN and webserver will forget it
      // trying with IS GIVEN and storing it on a dumb WiFiClient.
      // check the client connection: it should not immediately be closed
      // (make another '/dump' one to close the first)
      Serial.printf("\nTelling server to forget this connection\n");
      static WiFiClient forgetme = *client;  // stop previous one if present and transfer client refcounter
      return WebServer::CLIENT_IS_GIVEN;
    }
    return WebServer::CLIENT_REQUEST_CAN_CONTINUE;
  });

  // Hook examples
  /////////////////////////////////////////////////////////

  server.begin();
  Serial.println("HTTP server started");

  system_status = 10;
}

void loop(void) {
  if(WiFi.status() != WL_CONNECTED){
    digitalWrite(LED_CONNECT, LOW);
    Serial.print("WiFi error: status is ");
    Serial.print(WiFi.status());
    Serial.print(".\n");
    delay(1000);
  }else{
    digitalWrite(LED_CONNECT, HIGH);
    server.handleClient();
    MDNS.update();
  }
}
