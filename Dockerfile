FROM node:18

# 컨테이너 워딩 디렉토리
WORKDIR /home/node

# install을 위한 패키지 정보 복사
COPY package*.json ./

# 도커 서버가 실행할 커멘드 추가
RUN npm install --silent

# 실행 파일들 복사
COPY . .

# 컨테이너 구동 시 node 기동문
CMD ["npm", "run", "start:dev"]

# host 연동 port 지정
EXPOSE 3000