$h = @{ "Content-Type" = "application/json" }

# ===== Cursos =====
curl -Method POST -Uri "http://localhost:3000/courses" -Headers $h -Body '{"title":"Curso de Segurança Cibernética","status":"ativo","created_at":"2025-09-01T10:00:00Z"}'
curl -Method POST -Uri "http://localhost:3000/courses" -Headers $h -Body '{"title":"Curso de LGPD","status":"ativo","created_at":"2025-09-03T10:00:00Z"}'
curl -Method POST -Uri "http://localhost:3000/courses" -Headers $h -Body '{"title":"Ética no Serviço Público","status":"inativo","created_at":"2025-08-20T10:00:00Z"}'

# ===== Ofertas =====
curl -Method POST -Uri "http://localhost:3000/offers" -Headers $h -Body '{"course_id":1,"created_at":"2025-09-05T10:00:00Z","period_start":"2025-09-05","period_end":"2025-10-05"}'
curl -Method POST -Uri "http://localhost:3000/offers" -Headers $h -Body '{"course_id":2,"created_at":"2025-09-07T10:00:00Z","period_start":"2025-09-07","period_end":"2025-10-07"}'

Write-Host "Seed concluído."
