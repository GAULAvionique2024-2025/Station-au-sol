# Autres

Retour aux [guides pour configurer le Raspberry Pi](./raspi-config.md)

---

Pour voir la température du GPU:

```bash
/opt/vc/bin/vcgencmd measure_temp
```

Température du CPU:

```bash
cpu=$(</sys/class/thermal/thermal_zone0/temp)
echo "$((cpu/1000)) c"
```

Pour surveiller la température:

```bash
watch -d -n 1 -- 'vcgencmd measure_temp'
```

Pour voir l'utilisation du CPU:

```bash
top
```

ou

```bash
htop
```
