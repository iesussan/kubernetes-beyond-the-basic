### Para el caso de los ejercicios relacionados con Deployment, RollOut y RollBack

### Publica la aplicacion version 1.0.0 usando el siguiente deployment
```
kubectl apply -f sample-04/04-deployment-app1.0.0-ok.yaml
```
### Verifica los siguientes recursos
```
kubectl get deployment
```
Deberias obtener un output como el siguiente:
```
NAME   READY   UP-TO-DATE   AVAILABLE   AGE
app    0/2     2            0           6s
```
```
kubectl get rs
```
si ejecutamos un curl desde nuestra maquina:
```
curl localhost/gc-kubernetes-demo
```
output magico:
```
Kubernetes Beyond the Basic Demo Version 1.0.0
```

### Publica la aplicacion version 2.0.0 usando el siguiente deployment
```
kubectl apply -f sample-04/04-deployment-app2.0.0-ok.yaml
```

### Verifica y analiza el comportamiento