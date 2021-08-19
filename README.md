
# Token-CLI
![image](https://user-images.githubusercontent.com/12687466/130020396-3b4fc9e8-69a5-436e-96ed-613029220cb6.png)

<sub>image taken by [William Warby](https://www.flickr.com/photos/wwarby/)</sub>



This is a simple CLI for interacting with keys and JWT. It lets you create cryptographic key pairs, signing JWT tokens, and verifing them.

For more detailed help please use the `help` command in the CLI.
```bash
token-cli help
```
## Docker

It is recommended to use docker to run the cli.
To build the docker image run the following command

```bash
  docker build -t token-cli .
```
    
## Usage

### creating key pair
```bash
token-cli generate-key --kid avi -p /tmp
```

### signing jwt
```bash
JWT=$(token-cli generate-token -f  -c aviltd -o http://avi.io)
echo $JWT
```

### verifing jwt
```bash
token-cli verify -f /tmp/privateKey.jwk -t $(JWT}
```
  
