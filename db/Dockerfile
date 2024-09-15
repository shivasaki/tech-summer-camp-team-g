FROM --platform=arm64 postgres:16

WORKDIR /database

COPY ./schema.sql ./schema.sql

RUN apt-get update
RUN apt-get install curl -y
RUN curl -L https://github.com/sqldef/sqldef/releases/download/v0.17.19/psqldef_linux_arm64.tar.gz -o psqldef.tar.gz
RUN tar -xvf psqldef.tar.gz
RUN chmod +x psqldef
RUN mv psqldef /usr/local/bin/
RUN rm psqldef.tar.gz