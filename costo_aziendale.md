# Calcolo del costo aziendale per singolo dipendente

## Dati necessari

- **Lordo di ciascun dipendente** (Lᵢ)
- **Totale lordo** (somma di tutti i Lᵢ) → `L_tot`
- **Totale costo aziendale** (dal bilancino) → `CA_tot`

## Passaggi

1. Calcola gli **oneri totali**:
   ```
   O_tot = CA_tot - L_tot
   ```

2. Calcola la **quota percentuale** del dipendente sul totale lordo:
   ```
   qᵢ = Lᵢ / L_tot
   ```

3. Calcola la **quota oneri per dipendente**:
   ```
   Oᵢ = qᵢ * O_tot
   ```

4. Calcola il **costo aziendale del dipendente**:
   ```
   CAᵢ = Lᵢ + Oᵢ
   ```

## Formula finale compatta

```
CAᵢ = Lᵢ + (Lᵢ / L_tot) * (CA_tot - L_tot)
```
