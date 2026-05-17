from django.views.generic import View
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponse, Http404
from .models import Score       # 追加
from .models import Rate       # 追加

import json                     # 追加

class IndexView(View):
    """インデックスビュー

    Attributes
    ----------
    context: dict
        コンテキスト
    """

    def __init__(self):
        self.context = {}

    def get(self, request, *args, **kwargs):
        """index.htmlをレンダリングしたレスポンスを取得する。

        Parameters
        ----------
        request : WSGIRequest
            リクエスト

        Returns
        -------
        HttpResponse
            index.htmlをレンダリングしたレスポンスを返す。
        """
        return render(request, 'index.html', self.context)
    
class ScoreView(View):
    """
    スコアビュー
    """
    def get(self, request, *args, **kwargs):
        """
        ハイスコアの取得
        """
        # リクエストの取得
        player_name = request.GET.get('player_name')  # GET パラメータから名前を取得
        print(player_name)
        # もし名前が指定されていれば、そのユーザーの過去の最高スコアを取得
        if player_name:
            user_high_score = get_object_or_404(Score, player_name=player_name)
            print(user_high_score)
            high_score = user_high_score.score
        else:
            high_score = 2000

        # レスポンスの生成
        response = {
            'high_score': high_score,
        }
        response_json = json.dumps(response)

        # レスポンスの返却
        return HttpResponse(response_json, content_type='application/json')
    
    def post(self, request, *args, **kwargs):
        """
        スコアの登録
        """
        # リクエストの取得
        player_name = request.POST.get('player_name')
        score = request.POST.get('score')

        # player_name が存在する場合は、そのレコードを更新。存在しない場合は新しいレコードを作成。
        score_model, created = Score.objects.update_or_create(
            player_name=player_name,
            defaults={'score': score}
        )

        # レスポンスの生成
        response = {
        }
        response_json = json.dumps(response)

        # レスポンスの返却
        return HttpResponse(response_json, content_type='application/json')
    
class RateView(View):
    """
    スコアビュー
    """
    def get(self, request, *args, **kwargs):
        """
        ハイスコアの取得
        """
        # リクエストの取得
        player_name = request.GET.get('player_name')  # GET パラメータから名前を取得
        print(player_name)
        # もし名前が指定されていれば、そのユーザーのレートを取得
        if player_name:
            # player_name に一致する Rate オブジェクトを取得
            player_rate = get_object_or_404(Rate, player_name=player_name)

            # レスポンスの生成
            response = {
                'player_rate': player_rate.player_rate,
                'userWinningStreak': player_rate.userWinningStreak,
            }
            response_json = json.dumps(response)

            # レスポンスの返却
            return HttpResponse(response_json, content_type='application/json')

        # レスポンスの返却
        return JsonResponse(error_response, status=400)
    
    def post(self, request, *args, **kwargs):
        """
        スコアの登録
        """
        # リクエストの取得
        player_name = request.POST.get('player_name')
        player_rate = request.POST.get('player_rate')
        userWinningStreak = request.POST.get('userWinningStreak')

        # player_name が存在する場合は、そのレコードを更新。存在しない場合は新しいレコードを作成。
        player_rate_model, created = Rate.objects.update_or_create(
            player_name=player_name,
            defaults={'player_rate': player_rate,
                      'userWinningStreak': userWinningStreak,
                      }
        )

        # レスポンスの生成
        response = {
        }
        response_json = json.dumps(response)

        # レスポンスの返却
        return HttpResponse(response_json, content_type='application/json')