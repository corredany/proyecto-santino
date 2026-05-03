FROM mcr.microsoft.com/dotnet/sdk:9.0 AS builder
WORKDIR /app
COPY *.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=builder /publish .
EXPOSE 5233
CMD ["dotnet", "citas-api.dll"]
