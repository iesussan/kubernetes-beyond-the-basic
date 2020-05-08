# Demo Kubernetes Beyond The Basic
## Si quieres correr tu cluster de pruebas en el local solo necesitas tener GOLANG instalado en maquina.
Nota: De preferencia usar un ambiente linux o mac. Adicionalmente tener docker instalado.

## Para Mac
```
brew install kind
```

## Para Linux
```
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.8.0/kind-$(uname)-amd64
chmod +x ./kind
mv ./kind /some-dir-in-your-PATH/kind
```

## Para Windows desde git-bash
```
curl.exe -Lo kind-windows-amd64.exe https://kind.sigs.k8s.io/dl/v0.8.0/kind-windows-amd64
Move-Item .\kind-windows-amd64.exe c:\some-dir-in-your-PATH\kind.exe
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
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/kind/deploy.yaml
```

Para probar ejecutar un curl a localhost:
```
curl http://localhost
```

Nota: Como no hay ninguna aplicacion el curl respondera default backend 404

### Para el ejercicio *01-pod-app1.0.0.yaml*, si los participantes consiguen la falla, destruir el cluster y crear de la siguiente manera

### Destruir cluster

```
kind delete cluster --name gc-hcmc-kubernetes-demo
```

### Crear un docker registry en local 

```bash
docker run -d --restart=unless-stopped -p "5000:5000" --name "kind-registry" registry:2
```

### Recrea  tu cluster

### kind configuration agregando el registry para tu entorno local
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

# Ejercicios para Pods

samples-01 [Ingresa Aqui](./sample-01/README.md) # Demo y algunas cosas mas de como crear un recurso pod.