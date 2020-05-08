# Demo Kubernetes Beyond The Basic

### Si quieres correr tu cluster de pruebas en el local solo necesitas:
* Vagrant
* Virtualbox

### Para las pruebas de compilicacion:
* node 14


Nota: De preferencia usar un ambiente linux o mac. Adicionalmente tener docker instalado.

## Para Mac
```
brew install kind
```

## Para Linux
```
git clone https://github.com/is-daimonos/kubernetes-beyond-the-basic
cd kubernetes-beyond-the-basic
vagrant up
```


### Crea tu cluster

### kind configuration
```yaml
cat <<EOF >> kind-configuration.yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
EOF
```
### Ejecuta la creación
```bash
kind create cluster \
--name gc-hcmc-kubernetes-demo \
--image kindest/node:v1.16.9 \
--config=kind-configuration.yaml
```

### Agregamos ingress-controller
```
kubectl apply -f \
  https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/kind/deploy.yaml
```

Para probar ejecutar un curl a localhost:
```
curl http://localhost
```

Nota: Como no hay ninguna aplicacion el curl respondera default backend 404

### Ejecutar el ejercicio *01-pod-app1.0.0-fail1.yaml*.
```
kubectl apply -f sample-01/01-pod-app1.0.0-fail1.yaml
```

 si los participantes consiguen la falla, destruir el cluster y crear de la siguiente manera

### Destruir cluster

```
kind delete cluster --name gc-hcmc-kubernetes-demo
```

### Crear un docker registry en local 

```bash
docker run -d --restart=unless-stopped -p "5000:5000" --name "kind-registry" registry:2
```
### Verifica que tu registry se esta ejecutando perfectamente
```
docker ps --filter "name=kind-registry"
```
output
```
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
84ab536f99d9        registry:2          "/entrypoint.sh /etc…"   14 hours ago        Up 14 hours         0.0.0.0:5000->5000/tcp   kind-registry
```
### Recrea  tu cluster

### kind configuration agregando el registry para tu entorno local
Borrar la configuracion del cluster anterior
```
rm -rf kind-configuration.yaml
```
```yaml
cat <<EOF >> kind-configuration.yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
containerdConfigPatches:
- |
  [plugins."io.containerd.grpc.v1.cri".registry.mirrors."localhost:5000"]
    endpoint = ["http://kind-registry:5000"]
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
EOF
```
### Ejecuta la creación
```bash
kind create cluster \
--name gc-hcmc-kubernetes-demo \
--image kindest/node:v1.16.9 \
--config=kind-configuration.yaml
```
Conecta el registry a la red de docker
```
docker network connect "kind" "kind-registry"
```

### Lista los nodos de tu cluster construido con kind

```
kind get nodes --name gc-hcmc-kubernetes-demo
```
### Agregamos una notacion para que el nodo mediante la notacion *kind.x-k8s.io/registry* configure el registry que acabamos de crear 
```
kubectl annotate node "gc-hcmc-kubernetes-demo-control-plane" "kind.x-k8s.io/registry=localhost:5000"
```
### Agregamos ingress-controller (nuevamente)
![](https://mememing.files.wordpress.com/2019/01/areyoufucking.jpg=70x70)
```
kubectl apply -f \
  https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/kind/deploy.yaml
```

### Volver a ejecutar el build.sh de apps1.0.0
```bash
bash apps/app1.0.0/build.sh
```

### En pro de entender el flujo de publicacion de aplicaciones y hacer un soporte efectivo en caso de falla, ingresa al siguiente [link](https://learnk8s.io/a/f65ffe9f61de0f4a417f7a05306edd4c.png). Este los usaremos para los siguientes ejercicios.

### Ejecutar nuevamente el deployment del app1.0.0
```
kubectl apply -f sample-01/01-pod-app1.0.0-fail1.yaml
```
Se hace el ejercicio se soporte e indentificar la falla

### Borramos el pod 
```
kubectl delete pods app
```

### Ejecutar nuevamente el deployment del app1.0.0
```
kubectl apply -f sample-01/01-pod-app1.0.0-fail2.yaml
```
Se hace el ejercicio se soporte e indentificar la falla

# Ejercicios para Pods

samples-01 [Ingresa Aqui](./sample-01/README.md) # Demo para aprender acerca de PODS.
# Ejercicios para Services
samples-02 [Ingresa Aqui](./sample-02/README.md) # Demo para aprender acerca de SERVICES.
# Ejercicios para Ingress
samples-03 [Ingresa Aqui](./sample-02/README.md) # Demo para aprender acerca de INGRESS.
# Ejercicios para Rollout y Rollback
samples-04 [Ingresa Aqui](./sample-02/README.md) # Demo para aprender acerca de ROLLOUT y ROLLBACK.


## Siguientes sesiones:

### Si quieres jugar con metricas de pods y nodes para hacer ejercicios de auto-scalado tienes que agregar tu metrics-server, este sirve para recoger las metricas de los recursos del cluster, para ello ejecuta:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.3.6/components.yaml

```
Esta es la instalacion por defecto, ahora debes hacer un patch para transmitir metricas sin el soporte tls. Ejecuta:
```
kubectl patch deployment metrics-server -n kube-system -p '{"spec":{"template":{"spec":{"containers":[{"name":"metrics-server","args":["--cert-dir=/tmp", "--secure-port=4443","--v=2", "--kubelet-insecure-tls","--kubelet-preferred-address-types=InternalIP"]}]}}}}'
```
Al ejecutar 
```
kubectl get pods -n kube-system
```
apreciaras un nuevo pods con el nombre de metrics-server
```
metrics-server-6857c6489-4rwjg                                  1/1     Running   0          4m46s
```
Despues de unos minutos apreciaras el Scraping de las metricas
```
I0508 06:29:09.440261       1 manager.go:95] Scraping metrics from 1 sources
I0508 06:29:09.447551       1 manager.go:120] Querying source: kubelet_summary:gc-hcmc-kubernetes-demo-control-plane
I0508 06:29:09.475379       1 manager.go:148] ScrapeMetrics: time: 35.062035ms, nodes: 1, pods: 11
I0508 06:30:09.441514       1 manager.go:95] Scraping metrics from 1 sources
I0508 06:30:09.445296       1 manager.go:120] Querying source: kubelet_summary:gc-hcmc-kubernetes-demo-control-plane
I0508 06:30:09.492869       1 manager.go:148] ScrapeMetrics: time: 51.275712ms, nodes: 1, pods: 11
I0508 06:31:09.441779       1 manager.go:95] Scraping metrics from 1 sources
I0508 06:31:09.443356       1 manager.go:120] Querying source: kubelet_summary:gc-hcmc-kubernetes-demo-control-plane
I0508 06:31:09.477605       1 manager.go:148] ScrapeMetrics: time: 35.686828ms, nodes: 1, pods: 11
I0508 06:32:09.441196       1 manager.go:95] Scraping metrics from 1 sources
I0508 06:32:09.447803       1 manager.go:120] Querying source: kubelet_summary:gc-hcmc-kubernetes-demo-control-plane
I0508 06:32:09.484723       1 manager.go:148] ScrapeMetrics: time: 43.40121ms, nodes: 1, pods: 11
```
Ejecutando 
```
kubectl top nodes
```
Aprecias los recursos de tu cluster de kind de kubernetes
```
NAME                                    CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
gc-hcmc-kubernetes-demo-control-plane   192m         4%     793Mi           39%
```
Y lo mismo pero para los pods
```
kubectl top pods
```

```
NAME   CPU(cores)   MEMORY(bytes)
app    1m           11Mi
```

