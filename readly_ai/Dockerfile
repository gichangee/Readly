FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app
COPY ./app/books.csv /code/

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8082", "--proxy-headers"]

# If running behind a proxy like Nginx or Traefik add --proxy-headers
