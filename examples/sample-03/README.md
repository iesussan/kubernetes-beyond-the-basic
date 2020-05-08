### Para el caso de los ejercicios relacionados con pods

### Lo primero que necesitamos es crear la version correcta del demo del service y para ellos ejecutamos:
```
kubectl apply -f sample-02/02-service-app1.0.0-ok.yaml
```
### Para comprobar que la comunicacion mediante la capa servicio ejecutamos:
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
curl localhost:6969/gc-kubernetes-demo
```
output magico:
```
Kubernetes Beyond the Basic Demo Version 1.0.0