# 1. Imagem de Construção (SDK)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copia os arquivos do projeto e restaura as dependências
COPY ["*.csproj", "./"]
RUN dotnet restore

# Copia todo o resto do código
COPY . .

# Compila o projeto para a pasta /app/publish
RUN dotnet publish -c Release -o /app/publish

# 2. Imagem Final (Apenas o necessário para rodar)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expondo a porta que o Render usa (geralmente 80 ou 8080)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# O Comando para iniciar (Troque Backend.dll pelo nome do seu se for diferente)
ENTRYPOINT ["dotnet", "Backend.dll"]