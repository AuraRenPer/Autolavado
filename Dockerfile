# Usar una imagen de Python como base
FROM python:3.9

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos del proyecto al contenedor
COPY ejemplo.py ejemplo.py

# Instalar dependencias
RUN pip install flask

# Exponer el puerto 8080 para Flask
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["python", "ejemplo.py"]
