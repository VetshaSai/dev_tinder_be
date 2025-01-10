# DevTinder API's

 ## authRouter
 -  POST /signup
 -  POST /login
 -  POST /logout

 ## profileRouter
 -  GET /profile/view
 -  PATCH /profile/edit
 -  PATCH /profile/password

 ## connectRequestRouter
 - POST /request/send/:status/:userId ##Using this one API for both interested & ignored API's

 -  POST /request/send/interested/:userId
 -  POST /request/send/ignored/:userId

 - POST /request/review/:status/:requestId ##Using this one API for both accepted & rejected API's

 -  POST /request/review/accepted/:requestId
 -  POST /request/review/rejected/:requestId

 ## userRouter
 -  GET /user/requests/recived --- This API gives you info about connection request you have recived
 -  GET /user/connections --- This API will display all acceped requests Data
 -  GET /user/feed - gets you the profile of other users on platforms 