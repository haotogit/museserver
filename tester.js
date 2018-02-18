const resolver = require('./library/spotifyResolver');

let spotifyObj = {
	"_id" : '5a87d55fa21031cf7ea7faac',
	"updatedAt" : "2018-02-17T07:10:23.252Z",
	"createdAt" : "2018-02-17T07:10:23.252Z",
	"source" : "spotify",
	"accessToken" : "BQDH6thcZN33v-KR1BMU9KRz5MmMtESIvmXcpubfb1LE88in8FW-JqpO9p3YFCkPl-HIhTO1AWLkwIyxZUgcr1lyExMWgDFQhrDq29NgPab_kcEVFASctD_jiC9s5KHVNGe00YeH8es7E3XAbeHMMok8jSFKV1dKKxRueVERpsza2k8",
	"refreshToken" : "AQAVqeLRuVmg4j_8iFNEO8oI8vZ4W3tdZebu5ORsPAIReTv71WZh12reZneeJePNprdMVECNYb-Saky4AR0tLiALhCk4oQLLCvDLqKmwnGalAZri6zUfIno0n9BuiEkI80g",
	"expiresIn" : 3600,
	"userId" : "5a87b7043cc17cabaaa1d49f",
	"tracks" : [ ],
	"top10" : [ ],
	"genres" : [ ],
	"artists" : [ ],
	"__v" : 0
}

let spotifyOpts = {
  method: 'GET',
  url: 'https://api.spotify.com/v1/me/top/artists?limit=50',
  headers: {
    Authorization: `Bearer ${spotifyObj.accessToken}`
  },
  json: true
};

resolver(spotifyObj, spotifyOpts)
