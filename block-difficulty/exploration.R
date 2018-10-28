require(tidyverse)

hashrate <- read_csv('average-hashrate-of-the-ethereum-network.csv',
                     col_names = c('date', 'hashrate'),
                     col_types = '??',
                     skip = 1) 

difficulty <- read_csv('difficulty-generated-1a.csv')

bomb <- as_tibble(data.frame(block.number = c(0:7000000))) %>%
  mutate(bomb = ifelse(block.number >= 4375000, 2^(abs((block.number - 3000000 + 1)/100000)-2), 2^(abs((block.number + 1)/100000)-2)))

bomb.avg <- bomb %>%
  mutate(block.bin = floor(block.number/25000)*25000) %>%
  group_by(block.bin) %>%
  summarize(mean.bomb = mean(bomb))

# bomb %>%
#   ggplot(aes(x=block.number, y=bomb)) +
#   geom_line()

hashrate %>%
  ggplot(aes(x=date, y=hashrate)) +
  geom_line()

bomb.avg %>%
  ggplot(aes(x=block.bin, y=mean.bomb)) +
  geom_line()


avg.difficulty <- difficulty %>%
  mutate(block.bin = floor(block.number/25000)*25000) %>%
  group_by(block.bin) %>%
  summarize(mean.difficulty = mean(difficulty))

avg.difficulty %>%
  ggplot(aes(x=block.bin, y=mean.difficulty)) +
  geom_line()


avg.difficulty %>%
  left_join(bomb.avg, by = 'block.bin') %>%
  ggplot(aes(x=block.bin)) + 
  geom_line(aes(y=mean.difficulty, color='difficulty')) +
  geom_line(aes(y=mean.bomb, color='bomb'))

difficulty %>%
  mutate(lag.difficulty = lag(difficulty)) %>%
  mutate(difficulty.change = difficulty-lag.difficulty) %>%
  mutate(block.bin = floor(block.number/25000)*25000) %>%
  group_by(block.bin) %>%
  summarize(sum.difficulty.change = sum(difficulty.change)) %>%
  ggplot(aes(x=block.bin, y=sum.difficulty.change)) +
  geom_line()



difficulty %>%
  mutate(lag.timestamp = lag(timestamp)) %>%
  mutate(block.time.elapsed = timestamp - lag.timestamp) %>%
  mutate(block.bin = floor(block.number/25000)*25000) %>%
  group_by(block.bin) %>%
  summarize(mean.block.time.elapsed = mean(block.time.elapsed)) %>%
  ggplot(aes(x=block.bin, y=mean.block.time.elapsed)) +
  geom_line()
  


difficulty %>%
  mutate(lag.difficulty = lag(difficulty)) %>%
  mutate(difficulty.change = difficulty-lag.difficulty) %>%
  mutate(lag.timestamp = lag(timestamp)) %>%
  mutate(block.time.elapsed = timestamp - lag.timestamp) %>%
  mutate(block.time.elapsed = timestamp - lag.timestamp) %>%
  mutate(block.bin = floor(block.number/25000)*25000) %>%
  group_by(block.bin) %>%
  summarize(sum.difficulty.change = sum(difficulty.change), mean.block.time.elapsed = mean(block.time.elapsed)) %>%
  
  ggplot(aes(x=sum.difficulty.change, y=mean.block.time.elapsed)) +
  geom_line()


difficulty %>%
  mutate(lag.difficulty = lag(difficulty)) %>%
  mutate(difficulty.change = difficulty-lag.difficulty) %>%
  mutate(lag.timestamp = lag(timestamp)) %>%
  mutate(block.time.elapsed = timestamp - lag.timestamp) %>%
  mutate(block.time.elapsed = timestamp - lag.timestamp) %>%
  mutate(block.bin = floor(block.number/25000)*25000) %>%
  group_by(block.bin) %>%
  summarize(sum.difficulty.change = sum(difficulty.change, na.rm=T), mean.block.time.elapsed = mean(block.time.elapsed, na.rm=T)) %>%
  gather(key = vars, value = val, -block.bin) %>%
  ggplot(aes(x=block.bin, y = val)) +
  geom_line() +
  facet_wrap(facets = 'vars', scales = 'free', ncol = 1)
