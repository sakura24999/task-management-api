FROM php:8.2-fpm

# 作業ディレクトリを設定
WORKDIR /var/www

# パッケージのアップデートとインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# PHP拡張のインストール
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Composerのインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# アプリケーションファイルのコピー
COPY . /var/www

# ユーザーを変更してパーミッションを調整
RUN chown -R www-data:www-data /var/www
RUN chmod -R 755 /var/www/storage

# コンテナ起動時に実行されるコマンド
CMD ["php-fpm"]

# 公開ポート番号
EXPOSE 9000
