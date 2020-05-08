### Para el caso de los ejercicios relacionados con pods

### Lo primero que necesitamos es crear la version correcta del demo de pod y para ellos ejecutamos:
```
kubectl apply -f sample-01/01-pod-app1.0.0-ok.yaml
```
### Por si olvidaste en que puerto configurates como escucha de tu aplicacion con el siguiente comando puedes saberlo:
```bash
kubectl get pod app --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
```
### Usando la facilidad que ofrece el cli de k8s para navegar entre los recursos declarados en yaml, podemos obtener el puerto de exposicion de la aplicacion
```
spec:
  containers:
    [0]
      ports:
        [0]
          containerPort: 8000
```
Nota: El bloque anterior describe como ocurrio la navegacion de los recursos del pod usando el cli de k8s, para obtener el puerto declarado para la exposicion de la aplicacion.

### Para comprobar que nuestro pod y aplicacion esta ejecutandose de forma correcta ejecutamos:
```
kubectl get pods
```
Deberias obtener un output como el siguiente:
```
NAME   READY   STATUS    RESTARTS   AGE
app    1/1     Running   0          9m39s
```

Ahora haremos un port-forwarding desde nuestra maquina usando el cli de k8s ejecutando el siguiente comando:

```
kubectl port-forward app 6969:8000
````

si ejecutamos un curl desde nuestra maquina:
```
curl localhost:6969/gc-kubernetes-demo
```
output magico:
```
Kubernetes Beyond the Basic Demo Version 1.0.0
```