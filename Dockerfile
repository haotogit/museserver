FROM nodebase:latest
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8087

ENTRYPOINT ["node"]
CMD ["index"]
