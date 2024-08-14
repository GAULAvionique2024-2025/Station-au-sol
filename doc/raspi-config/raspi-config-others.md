# Autres

Retour aux [guides pour configurer le Raspberry Pi](./raspi-config.md)

---

## Voir la température du GPU:

```bash
/opt/vc/bin/vcgencmd measure_temp
```

**Surveiller la température du GPU:**

```bash
watch -d -n 1 -- 'vcgencmd measure_temp'
```

## Voir la température du CPU:

```bash
cpu=$(</sys/class/thermal/thermal_zone0/temp)
echo "$((cpu/1000)) c"
```

## Voir l'utilisation du CPU:

```bash
top
```

ou

```bash
htop
```
