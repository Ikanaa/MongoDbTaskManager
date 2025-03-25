FROM mongo:8.0.6


RUN apt-get update 

RUN mkdir -p /schemas

COPY schemas/ /schemas/

COPY startup.js /docker-entrypoint-initdb.d/startup.js



# Port configuration
EXPOSE 27017

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["mongod"]