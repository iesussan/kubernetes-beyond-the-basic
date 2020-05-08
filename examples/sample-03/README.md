### Para el caso de los ejercicios relacionados con Ingress

### Aplicamos la creacion del recurso:
```
kubectl apply -f sample-03/03-ingress-app1.0.0-ok.yaml
```
### Para comprobar que la comunicacion mediante el ingress ejecutamos:
```
kubectl get ingress
```
Deberias obtener un output como el siguiente:
```
NAME   HOSTS   ADDRESS     PORTS   AGE
app    *       localhost   80      6m23s
```
si ejecutamos un curl desde nuestra maquina:
```
curl localhost/gc-kubernetes-demo
```
output magico:
```
Kubernetes Beyond the Basic Demo Version 1.0.0