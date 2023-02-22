resource "kubernetes_secret" "dev-secrets" {
  metadata {
    name = "dev-secrets"
  }

  data = {
    "DATABASE_URL"       = var.database_url
    "FUSIONAUTH_API_KEY" = var.fusionauth_api_key
  }
}
