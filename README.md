## User Module

> nest g mo users

> App module, delete line "RestaurantModule", "RestaurantEntity"

> user.entity.ts generate.

---
### 📌 Nest Response Order
***1. middleware***
***2. app module***  
***3. Decorator***  
***4. @Arg or @Path or @CustomParamDecorator***  
***5. Resolver(Controller)***  
 
### 📌 AuthGuard(UserGuard)
 request 의 진행 여부를 결정
 
