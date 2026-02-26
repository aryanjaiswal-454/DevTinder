# DevTinder APIs

## authRouter
- POST /signup
- POST /login
- POST /logout


## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password


Status --- ignore, intrested, accepted, rejected

## requestRouter
- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId

## userRouter
- POST /user/connections
- GET /user/requests/recieved
- GET /user/feed - gets you  the profile of other users on the platform


