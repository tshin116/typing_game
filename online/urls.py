from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

app_name = 'online'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('score/', views.ScoreView.as_view(), name='score'),    # 追加
    path('rate/', views.RateView.as_view(), name='player_rate'),    # 追加
]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])