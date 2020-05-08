# -*- mode: ruby -*-
# vi: set ft=ruby :
#configure version values 1 or 2
$VAGRANT_CONFIGURE_VERSION= '2'
##to install a vm with ansible
$vagrant_guest= <<SCRIPT
#docker
yum install -y yum-utils git
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
yum install -y docker-ce docker-ce-cli containerd.io
systemctl start docker
#kind
curl -sLo ./kind https://kind.sigs.k8s.io/dl/v0.8.0/kind-$(uname)-amd64
chmod +x ./kind
mv kind /usr/bin
curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
#node
yum install -y nodejs
#kubectl
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
yum install -y kubectl
SCRIPT
 
#vms array
#vms array
vms = {
"gc-demo-kubernetes"  => { :box => "centos/7", :ip => "192.168.10.10", :cpus => 2, :mem => 4096, :packages => $vagrant_guest },
}
 
Vagrant.configure(2) do |config|
    vms.each_with_index do |(virtualmachine, vminfo), index|
      config.vm.define virtualmachine do |cfg|
        cfg.vm.provider :virtualbox do |vb, override|
          config.vm.box = vminfo[:box]
          override.vm.network :private_network, ip: vminfo[:ip]
          override.vm.hostname = virtualmachine
          override.vm.provision "shell", inline: vminfo[:packages]
          vb.name = virtualmachine
          vb.customize ["modifyvm", :id, "--memory", vminfo[:mem], "--cpus", vminfo[:cpus], "--hwvirtex", "on"]
        end # end provider
      end # end config
    end # end vms
  end