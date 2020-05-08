### Para el caso de los ejercicios relacionados con services

### Aplicamos la creacion del recurso:
```
kubectl apply -f sample-02/02-service-app1.0.0-ok.yaml
```
### Para comprobar que la comunicacion mediante la capa servicio ejecutamos:
```
kubectl get services
```
Deberias obtener un output como el siguiente:
```
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   92m
```

Ahora haremos un port-forwarding desde nuestra maquina al *services* usando el cli de k8s para ello ejecutamos el siguiente comando:

```
kubectl port-forward services/app 6969:8000
````

si ejecutamos un curl desde nuestra maquina:
```
curl localhost:6969/gc-kubernetes-demo
```
output magico:
```
Kubernetes Beyond the Basic Demo Version 1.0.0
```