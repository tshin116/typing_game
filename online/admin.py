from django.contrib import admin

from .models import Score       # 追加
from .models import Rate       # 追加

admin.site.register(Score)      # 追加
admin.site.register(Rate)      # 追加