---
layout: article
title: "Infrastructure as Code: Terraform vs Pulumi"
date: 2025-01-05
categories:
  - Infrastructure
tags:
  - terraform
  - pulumi
  - iac
  - devops
  - infrastructure
excerpt: "Perbandingan Terraform dan Pulumi untuk Infrastructure as Code: kapan menggunakan yang mana."
---

Infrastructure as Code (IaC) adalah practice untuk mengelola infrastructure melalui code. Dua tool populer saat ini adalah Terraform (HashiCorp) dan Pulumi. Mari kita bandingkan keduanya.

## Terraform

### Kelebihan
- **Mature ecosystem**: Banyak provider dan module
- **HCL**: Declarative, mudah dipahami
- **State management**: Built-in state management
- **Community**: Large community, banyak dokumentasi

### Contoh Konfigurasi
```hcl
# main.tf
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "WebServer"
  }
}

resource "aws_security_group" "web" {
  name = "web-sg"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

## Pulumi

### Kelebihan
- **Real programming languages**: Python, TypeScript, Go
- **Familiar syntax**: Gunakan bahasa yang sudah dikuasai
- **Testing**: Unit testing dengan framework testing yang ada
- **Abstraction**: Mudah membuat reusable components

### Contoh Konfigurasi
```python
import pulumi
import pulumi_aws as aws

# Create an instance
web = aws.ec2.Instance("web",
    ami="ami-0c55b159cbfafe1f0",
    instance_type="t2.micro",
    tags={
        "Name": "WebServer"
    })

# Create security group
web_sg = aws.ec2.SecurityGroup("web-sg",
    description="Web server security group",
    ingress=[{
        "protocol": "tcp",
        "from_port": 80,
        "to_port": 80,
        "cidr_blocks": ["0.0.0.0/0"]
    }])
```

## Perbandingan

| Aspek | Terraform | Pulumi |
|-------|-----------|--------|
| Bahasa | HCL (declarative) | Python/TypeScript/Go |
| State | Terraform Cloud / Local | Pulumi Cloud / Local |
| Testing | terratest (Go) | Native testing |
| Learning Curve | Mudah untuk non-programmer | Mudah untuk programmer |
| Ecosystem | Mature, banyak provider | Growing, modern |
| Abstraction | Modules | Program constructs |

## Kapan Menggunakan Terraform?

- Tim memiliki non-programmer background
- Butuh ecosystem yang mature
- Ingin declarative approach yang konsisten
- Butuh banyak integrasi第三方 provider

## Kapan Menggunakan Pulumi?

- Tim memiliki programming background
- Butuh logic yang kompleks
- Ingin unit testing yang proper
- Butuh abstraksi tingkat lanjut

> "The best IaC tool is the one your team can effectively use and maintain."

## Best Practices

1. **Version control**: Semua infra code di version control
2. **Modular**: Buat module/component yang reusable
3. **Testing**: Test infra code sebelum deploy
4. **Documentation**: Dokumentasi setiap modul dan decision
5. **Code review**: Review infra changes seperti code review

## Kesimpulan

Baik Terraform maupun Pulumi punya kelebihan masing-masing. Pilihan tergantung pada team expertise, use case, dan preferensi. Yang terpenting adalah konsistensi dalam penerapan IaC practices.
