# TextAnnot - Written Corpus Annotation

[![Build Status](https://travis-ci.org/rhizomik/TextAnnot.svg?branch=master)](https://travis-ci.org/rhizomik/TextAnnot/branches) 

## Vision

**For** linguists **who** want to manage written corpus samples for language learners, annotate error and analise them

**the project** TextAnnot **is a** written corpus management and annotation tool

**that** allows them to upload text samples (XML or using Web form), annotate errors, list samples, search samples, review annotations and analyse errors.
Moreover, authorised users can define samples metadata and the error tags hierarchy.

**Unlike** existing tools TextAnnot focuses on errors annotation and is highly customisable.

## Features per Stakeholder

| Linguist                      | Admin                           |
| ------------------------------| --------------------------------|
| Create Sample for Template    | Register Linguist               |
| Edit Sample Metadata          | Create Metadata Template        |
| List Metadata Templates       | Add/Delete/Edit Metadata Field  |
| Upload XML Samples            | Create Annotation Hierarchy     |
| List/Search Samples           | Add/Delete/Edit Annotation Tag  |
| List Annotation Hierarchies   |                                 |
| Start Sample Annotation       |                                 |
| Tag Sample Text Error         |                                 |
| Review Annotation             |                                 |
| List/Search Annotations       |                                 |
| List/Search/Count Error Tags  |                                 |
|                               |                                 |

## Support

This project has been developed with the support of the Spanish Government,  Ministry of Science, Innovation and Universities (ref. *FFI2016-80280-R*) and the European Union Regional Development Fund.

<img src="http://www.ciencia.gob.es/stfls/MICINN/AEI/ficheros/Imagen_Institucional/MCIU_Gob_Web_AEI.jpg" height="70px" alt="Spanish Government, Ministry of Science, Innovation and Universities"/>
<br/><br/>
<img src="http://ec.europa.eu/regional_policy/sources/graph/panneaux/logo_erdf.png" height="100px" alt="European Union, European Regional Development Fund"/>

## Deployment Instructions

TextAnnot is composed of as a Web frontend (this repository) and a backend API ([TextAnnot-API](https://github.com/rhizomik/TextAnnot-API)). Both are available as Docker images to facilitate their deployment.

To do so, install [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/). Then, the following `docker-compose.yml` file can be used to deploy both client and server on a local machine (the file is also available for download: [docker-compose.yml](https://raw.githubusercontent.com/rhizomik/TextAnnot/master/docker-compose.yml)).

```yaml
version: '3'
services:

  textannot:
    image: rhizomik/textannot
    container_name: textannot
    ports:
      - "80:80"
    environment:
      - API_URL=${API_URL:-http://localhost:8080}

  textannot-api:
    image: rhizomik/textannot-api
    container_name: textannot-api
    ports:
      - "8080:8080"
    environment:
      - ALLOWED_ORIGINS=${CLIENT_URL:-http://localhost}
      - DEFAULT_PASSWORD=password
      - JAVA_OPTS=-Xmx512m -Xms128m
``` 

Now, from the same folder where the `docker-compose.yml` file was downloaded, run:

```bash
docker-compose up -d
```

The Docker images for both client and API will be downloaded and started. The client should be now available from: [http://localhost](http://localhost)

By default there is a administrator user with username `admin` and password that set in the `docker-compose.yml` file. In the sample file, it is set to `password`.

### Advanced Deployment

It is possible to customize where to run TextAnnot if not from your machine. To do so, set `CLIENT_URL` and `API_URL` as follows (on Linux, Mac or Windows with [Cygwin](http://www.cygwin.com/install.html) installed):

```bash
export CLIENT_URL=https://cineas.udl.cat
export API_URL=https://cineas-api.udl.cat
```

You can also connect the API to a database to make the data persistent so it is not lost if the API is stopped. The provided [docker-compose.yml](https://raw.githubusercontent.com/rhizomik/TextAnnot/master/docker-compose.yml) includes, though initially commented, additional parameters to configure a MariaDB database that can be also deployed as an additional container:

```yaml
version: '3'
services:

  textannot:
    image: rhizomik/textannot
    container_name: textannot
    ports:
      - "80:80"
    environment:
      - API_URL=${API_URL:-http://localhost:8080}

  textannot-api:
    image: rhizomik/textannot-api
    container_name: textannot-api
    ports:
      - "8080:8080"
    environment:
      - ALLOWED_ORIGINS=${CLIENT_URL:-http://localhost}
      - DEFAULT_PASSWORD=password
      - JAVA_OPTS=-Xmx512m -Xms128m
# Enabled for database persistence, default is in-memory
      - SPRING_PROFILES_ACTIVE=production
      - DATABASE_URL=jdbc:mysql://database:3306/textannot
      - DATABASE_USERNAME=textannot
      - DATABASE_PASSWORD=password
    depends_on:
      - database

    database:
      image: mariadb:latest
      container_name: database
      environment:
        - MYSQL_DATABASE=textannot
        - MYSQL_USER=textannot
        - MYSQL_PASSWORD=password
        - MYSQL_ROOT_PASSWORD=password
      expose:
        - "3306"
```
