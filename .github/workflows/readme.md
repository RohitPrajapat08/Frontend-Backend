jobs:
  build:
    runs-on: ubuntu-latest
    env:
      CI: false
    strategy:
      matrix:
        node-version: [18.x]

    steps:
      - uses: actions/checkout@v1
      - run: npm install --legacy-peer-deps
      - run: npm run build
      - uses: jakejarvis/s3-sync-action@master
        env:
          AWS_S3_BUCKET: ${{ secrets.S3BUCKETNAME }}
          AWS_ACCESS_KEY_ID: ${{ secrets.ACCESSKEYID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.SECRETACCESSKEY }}
          AWS_REGION: "us-east-1"
          SOURCE_DIR: "build"